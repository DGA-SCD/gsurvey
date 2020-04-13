import React, {
  Component,
  useState,
  useCallback,
  useMemo,
  useEffect
} from "react";
import memoize from "memoize-one";
import axios from "axios";
import DataTable from "react-data-table-component";
import { Button } from "reactstrap";
import IconButton from "@material-ui/core/IconButton";
import DeleteIcon from "@material-ui/icons/Delete";
import Edit from "@material-ui/icons/Edit";
import * as config from "../../services/AppConfig";
export default function UserManagement() {
  const actions = <Button key="add">Add</Button>;

  const [selectedRows, setSelectedRows] = useState([]);
  const [toggleCleared, setToggleCleared] = useState(false);
  const [errors, seterrors] = useState();
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchUsers = async page => {
    setLoading(true);
    const requestOptions = {
      method: "GET",
      credentials: "include"
    };
    const res = await fetch(
      config.BACKEND_GSURVEY + `/api/v2/admin/members`,
      requestOptions
    )
      .then(response => response.json())
      .then(response => setData(response.data))
      .catch(err => seterrors(err));
    console.log(data);
    setLoading(false);
  };

  useEffect(() => {
    fetchUsers(1);
  }, []);
  const columns = [
    {
      name: "First Name",
      selector: "firstname",
      sortable: true
    },
    {
      name: "Last Name",
      selector: "lastname",
      sortable: true
    },
    {
      name: "Email",
      selector: "email",
      sortable: true
    },
    {
      name: "mobile",
      selector: "mobile",
      sortable: true
    },
    {
      cell: row => (
        <div>
          <IconButton
            color="primary"
            onClick={() => setSendRequest(row.user_id)}
          >
            <Edit />
          </IconButton>
          {/* <button onClick={() => setSendRequest(row.id)} id={row.id}>
            Action
          </button>

          <button onClick={() => sethandelEdit(row.id)} id={row.id}>
            Edit
          </button> */}
        </div>
      )
    }
  ];

  const setSendRequest = user_id => {
    console.log(user_id);
  };
  const sethandelEdit = user_id => {
    alert(user_id);
  };
  const handleRowSelected = useCallback(state => {
    setSelectedRows(state.selectedRows);
  }, []);

  const contextActions = useMemo(() => {
    const handleDelete = () => {
      if (
        window.confirm(
          `Are you sure you want to delete:\r ${selectedRows.map(
            r => r.user_id
          )}?`
        )
      ) {
        setToggleCleared(!toggleCleared);
        // setData(differenceBy(data, selectedRows, "name"));
      }
    };
    const handleEdit = () => {
      if (
        window.confirm(
          `Are you sure you want to edit:\r ${selectedRows.map(
            r => r.user_id
          )}?`
        )
      ) {
        setToggleCleared(!toggleCleared);
        // setData(differenceBy(data, selectedRows, "name"));
      }
    };

    return (
      <div>
        <Button
          key="delete"
          onClick={handleDelete}
          style={{ backgroundColor: "red" }}
          icon
        >
          Delete
        </Button>
      </div>
    );
  }, [data, selectedRows, toggleCleared]);

  return (
    <div>
      {/* {console.log(data)} */}
      <DataTable
        title="Arnold Movies"
        columns={columns}
        data={data}
        selectableRows // add for checkbox selection
        pagination
        // contextActions={contextActions}
        // onSelectedRowsChange={handleRowSelected}
        // clearSelectedRows={toggleCleared}
        // progressPending={loading}
      />
    </div>
  );
}
